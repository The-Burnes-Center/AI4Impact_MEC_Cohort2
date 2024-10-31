// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import InternalBox from '../box/internal';
import { useInternalI18n } from '../i18n/context';
import ChartPlot from '../internal/components/chart-plot';
import ChartPopover from '../internal/components/chart-popover';
import ChartPopoverFooter from '../internal/components/chart-popover-footer';
import SeriesDetails from '../internal/components/chart-series-details';
import SeriesMarker from '../internal/components/chart-series-marker';
import { useHeightMeasure } from '../internal/hooks/container-queries/use-height-measure';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { KeyCode } from '../internal/keycode';
import { nodeBelongs } from '../internal/utils/node-belongs';
import InternalLiveRegion from '../live-region/internal';
import Labels from './labels';
import Segments from './segments';
import { defaultDetails, getDimensionsBySize } from './utils';
import styles from './styles.css.js';
export default ({ fitHeight, height: explicitHeight, variant, size, width, i18nStrings, ariaLabel, ariaLabelledby, ariaDescription, innerMetricValue, innerMetricDescription, hideTitles, hideDescriptions, detailPopoverContent, detailPopoverSize, detailPopoverFooter, segmentDescription, highlightedSegment, onHighlightChange, legendSegment, pieData, dataSum, }) => {
    var _a, _b;
    const [pinnedSegment, setPinnedSegment] = useState(null);
    const plotRef = useRef(null);
    const containerRef = useRef(null);
    const focusedSegmentRef = useRef(null);
    const popoverTrackRef = useRef(null);
    const popoverRef = useRef(null);
    const hasLabels = !(hideTitles && hideDescriptions);
    const isRefresh = useVisualRefresh();
    const height = (_a = useHeightMeasure(() => { var _a, _b; return (_b = (_a = plotRef.current) === null || _a === void 0 ? void 0 : _a.svg) !== null && _b !== void 0 ? _b : null; }, !fitHeight)) !== null && _a !== void 0 ? _a : explicitHeight;
    const dimensions = useMemo(() => getDimensionsBySize({ size: fitHeight ? Math.min(height, width) : size, hasLabels, visualRefresh: isRefresh }), [fitHeight, height, width, size, hasLabels, isRefresh]);
    // Inner content is only available for donut charts and the inner description is not displayed for small charts
    const hasInnerContent = variant === 'donut' && (innerMetricValue || (innerMetricDescription && dimensions.size !== 'small'));
    const innerMetricId = useUniqueId('awsui-pie-chart__inner');
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [popoverData, setPopoverData] = useState();
    const highlightedSegmentIndex = useMemo(() => {
        for (let index = 0; index < pieData.length; index++) {
            if (pieData[index].data.datum === highlightedSegment) {
                return index;
            }
        }
        return null;
    }, [pieData, highlightedSegment]);
    const detailPopoverFooterContent = useMemo(() => (detailPopoverFooter && highlightedSegment ? detailPopoverFooter(highlightedSegment) : null), [detailPopoverFooter, highlightedSegment]);
    const i18n = useInternalI18n('pie-chart');
    const detailFunction = detailPopoverContent || defaultDetails(i18n, i18nStrings);
    const details = popoverData ? detailFunction(popoverData.datum, dataSum) : [];
    const popoverContentRef = useRef(null);
    const popoverContent = popoverData && React.createElement(SeriesDetails, { details: details, compactList: true, ref: popoverContentRef });
    const popoverDismissedRecently = useRef(false);
    const escapePressed = useRef(false);
    const duringTouch = useRef(false);
    const highlightSegment = useCallback((internalDatum) => {
        const segment = internalDatum.datum;
        if (segment !== highlightedSegment) {
            onHighlightChange(segment);
        }
        if (popoverTrackRef.current) {
            setPopoverData({
                datum: internalDatum.datum,
                series: {
                    color: internalDatum.color,
                    index: internalDatum.index,
                    label: internalDatum.datum.title,
                    markerType: 'rectangle',
                },
                trackRef: popoverTrackRef,
            });
            setPopoverOpen(true);
        }
    }, [highlightedSegment, setPopoverOpen, onHighlightChange]);
    const clearHighlightedSegment = useCallback(() => {
        setPopoverOpen(false);
        onHighlightChange(null);
    }, [onHighlightChange, setPopoverOpen]);
    const checkMouseLeave = (event) => {
        if (pinnedSegment !== null) {
            return;
        }
        if (nodeContains(popoverRef.current, event.relatedTarget) ||
            nodeContains(focusedSegmentRef.current, event.relatedTarget)) {
            return;
        }
        clearHighlightedSegment();
    };
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                clearHighlightedSegment();
                escapePressed.current = true;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [clearHighlightedSegment]);
    const onMouseDown = useCallback((internalDatum) => {
        if (pinnedSegment === internalDatum.datum) {
            setPinnedSegment(null);
            clearHighlightedSegment();
        }
        else {
            setPinnedSegment(internalDatum.datum);
            highlightSegment(internalDatum);
        }
    }, [pinnedSegment, clearHighlightedSegment, setPinnedSegment, highlightSegment]);
    const onMouseOver = useCallback((internalDatum) => {
        if (escapePressed.current) {
            escapePressed.current = false;
            return;
        }
        if (duringTouch.current) {
            duringTouch.current = false;
            return;
        }
        if (pinnedSegment !== null) {
            return;
        }
        highlightSegment(internalDatum);
    }, [pinnedSegment, highlightSegment]);
    const onTouchStart = useCallback(() => {
        duringTouch.current = true;
    }, []);
    const onKeyDown = useCallback((event) => {
        const keyCode = event.keyCode;
        if (keyCode !== KeyCode.right &&
            keyCode !== KeyCode.left &&
            keyCode !== KeyCode.enter &&
            keyCode !== KeyCode.space) {
            return;
        }
        event.preventDefault();
        let nextIndex = highlightedSegmentIndex || 0;
        const MAX = pieData.length - 1;
        if (keyCode === KeyCode.right) {
            nextIndex++;
            if (nextIndex > MAX) {
                nextIndex = 0;
            }
        }
        else if (keyCode === KeyCode.left) {
            nextIndex--;
            if (nextIndex < 0) {
                nextIndex = MAX;
            }
        }
        if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
            setPinnedSegment(pieData[nextIndex].data.datum);
        }
        highlightSegment(pieData[nextIndex].data);
    }, [setPinnedSegment, highlightSegment, pieData, highlightedSegmentIndex]);
    const onApplicationFocus = useCallback((_event, target) => {
        if (pinnedSegment !== null || popoverDismissedRecently.current || target === 'mouse') {
            return;
        }
        const segment = highlightedSegment || legendSegment || pieData[0].data.datum;
        const matched = pieData.filter(d => d.data.datum === segment);
        highlightSegment(matched[0].data);
    }, [pinnedSegment, pieData, highlightSegment, highlightedSegment, legendSegment]);
    const onApplicationBlur = useCallback((event) => {
        const blurTarget = event.relatedTarget || event.target;
        if (blurTarget === null || !(blurTarget instanceof Element) || !nodeBelongs(containerRef.current, blurTarget)) {
            // We only need to close the popover and remove the pinned segment so that we keep track of the current
            // highlighted legendSeries. using clearHighlightedSegment() would set the legendSeries to null, in that case
            // using Keyboard Tab will always highlight the first legend item in the legend component.
            setPopoverOpen(false);
            setPinnedSegment(null);
        }
    }, [setPinnedSegment]);
    const onPopoverDismiss = (outsideClick) => {
        setPopoverOpen(false);
        setPinnedSegment(null);
        if (!outsideClick) {
            // The delay is needed to bypass focus events caused by click or keypress needed to unpin the popover.
            setTimeout(() => {
                popoverDismissedRecently.current = true;
                plotRef.current.focusApplication();
                popoverDismissedRecently.current = false;
            }, 0);
        }
        else {
            onHighlightChange(null);
        }
    };
    return (React.createElement("div", { className: clsx(styles['chart-container'], fitHeight && styles['chart-container--fit-height']), ref: containerRef },
        React.createElement("div", { className: clsx(styles['chart-container-chart-plot'], fitHeight && styles['chart-container-chart-plot--fit-height']) },
            React.createElement(ChartPlot, { ref: plotRef, width: "100%", height: fitHeight ? '100%' : height, transform: `translate(${width / 2} ${height / 2})`, isPrecise: true, isClickable: !isPopoverOpen, ariaLabel: ariaLabel, ariaLabelledby: ariaLabelledby, ariaDescription: ariaDescription, ariaDescribedby: hasInnerContent ? innerMetricId : undefined, ariaRoleDescription: i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.chartAriaRoleDescription, activeElementRef: focusedSegmentRef, activeElementKey: highlightedSegmentIndex === null || highlightedSegmentIndex === void 0 ? void 0 : highlightedSegmentIndex.toString(), onApplicationFocus: onApplicationFocus, onApplicationBlur: onApplicationBlur, onKeyDown: onKeyDown, onMouseOut: checkMouseLeave },
                React.createElement(Segments, { pieData: pieData, dimensions: dimensions, variant: variant, focusedSegmentRef: focusedSegmentRef, popoverTrackRef: popoverTrackRef, highlightedSegment: highlightedSegment, segmentAriaRoleDescription: i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.segmentAriaRoleDescription, onMouseDown: onMouseDown, onMouseOver: onMouseOver, onTouchStart: onTouchStart }),
                hasLabels && (React.createElement(Labels, { pieData: pieData, dimensions: dimensions, segmentDescription: segmentDescription, visibleDataSum: dataSum, hideTitles: hideTitles, hideDescriptions: hideDescriptions, highlightedSegment: highlightedSegment, containerRef: containerRef })))),
        hasInnerContent && (React.createElement("div", { className: styles['inner-content'], id: innerMetricId },
            innerMetricValue && (React.createElement(InternalBox, { variant: dimensions.size === 'small' ? 'h3' : 'h1', tagOverride: "div", color: "inherit", padding: "n" }, innerMetricValue)),
            innerMetricDescription && dimensions.size !== 'small' && (React.createElement(InternalBox, { variant: "h3", color: "text-body-secondary", tagOverride: "div", padding: "n" }, innerMetricDescription)))),
        isPopoverOpen && popoverData && (React.createElement(ChartPopover, { ref: popoverRef, title: popoverData.series && (React.createElement(InternalBox, { className: styles['popover-header'], variant: "strong" },
                React.createElement(SeriesMarker, { color: popoverData.series.color, type: popoverData.series.markerType }),
                ' ',
                popoverData.series.label)), trackRef: popoverData.trackRef, trackKey: popoverData.series.index, dismissButton: pinnedSegment !== null, dismissAriaLabel: i18nStrings.detailPopoverDismissAriaLabel, onDismiss: onPopoverDismiss, container: ((_b = plotRef.current) === null || _b === void 0 ? void 0 : _b.svg) || null, size: detailPopoverSize, onMouseLeave: checkMouseLeave, onBlur: onApplicationBlur },
            popoverContent,
            detailPopoverFooterContent && React.createElement(ChartPopoverFooter, null, detailPopoverFooterContent))),
        React.createElement(InternalLiveRegion, { sources: [popoverContentRef] })));
};
//# sourceMappingURL=pie-chart.js.map
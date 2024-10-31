/// <reference types="react" />
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';
type InternalMixedLineBarChartProps<T extends ChartDataTypes> = SomeRequired<MixedLineBarChartProps<T>, 'series' | 'height' | 'xScaleType' | 'yScaleType' | 'stackedBars' | 'horizontalBars' | 'statusType' | 'detailPopoverSize' | 'emphasizeBaselineAxis'> & InternalBaseComponentProps;
export default function InternalMixedLineBarChart<T extends number | string | Date>({ fitHeight, height, xScaleType, yScaleType, xDomain, yDomain, xTickFormatter, yTickFormatter, highlightedSeries: controlledHighlightedSeries, visibleSeries: controlledVisibleSeries, series: externalSeries, onFilterChange, onHighlightChange: controlledOnHighlightChange, i18nStrings, ariaLabel, ariaLabelledby, ariaDescription, xTitle, yTitle, stackedBars, horizontalBars, hideFilter, additionalFilters, hideLegend, legendTitle, statusType, detailPopoverSize, detailPopoverFooter, detailPopoverSeriesContent, emphasizeBaselineAxis, empty, noMatch, errorText, loadingText, recoveryText, onRecoveryClick, __internalRootRef, ...props }: InternalMixedLineBarChartProps<T>): JSX.Element;
export {};
//# sourceMappingURL=internal.d.ts.map
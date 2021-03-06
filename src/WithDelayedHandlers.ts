import { compose, defaultProps, lifecycle, withHandlers, withPropsOnChange } from "recompose";
import { debounce, mapValues, pick, pipe, throttle } from "lodash/fp";
import { omitProps } from "./Helpers";

export type DelayedHandler = (...args: any) => () => void;

export interface IDelayedHandlers<TOuterProps> {
  [key: string]: (props: TOuterProps) => DelayedHandler;
}

export interface IWithDelayedHandlers {
  delayTimeout?: number;
  enableDebounce?: boolean;
  enableThrottle?: boolean;
}

export const DELAY_TIMEOUT = 200;

/**
 * An HOC which wraps recompose's `withHandlers` HOC, then wraps each of the given callback handlers
 * with `debounce` and `throttle` from `lodash` for the given `delayTimeout`.
 */
export const withDelayedHandlers = <TOuterProps = any>(
  handlers: IDelayedHandlers<TOuterProps>,
  options: IWithDelayedHandlers = {}
) => compose<TOuterProps & IWithDelayedHandlers, TOuterProps>(
  defaultProps({
    delayTimeout: DELAY_TIMEOUT,
    enableDebounce: true,
    enableThrottle: true,
    ...options,
  }),
  withHandlers(handlers),
  withPropsOnChange(
    ["delayTimeout", "enableDebounce", "enableThrottle"].concat(Object.keys(handlers)),
    ({ delayTimeout, enableDebounce, enableThrottle, ...props }: IWithDelayedHandlers & TOuterProps) => {
      return pipe(
        pick(Object.keys(handlers)),
        mapValues((handler: DelayedHandler) => {
          if (enableDebounce || enableThrottle) {

            const handlerDebounced = enableDebounce && debounce(delayTimeout)(callback => callback());
            const handlerThrottled = enableThrottle && throttle(delayTimeout)(callback => callback());

            const delayedHandler: any = (...args) => {
              const callback = handler(...args);

              if (handlerDebounced) {
                handlerDebounced(callback);
              }

              if (handlerThrottled) {
                handlerThrottled(callback);
              }
            };

            delayedHandler.cancel = () => {
              if (handlerDebounced) {
                handlerDebounced.cancel();
              }

              if (handlerThrottled) {
                handlerThrottled.cancel();
              }

            };

            return delayedHandler;
          } else {
            return (...args) => handler(...args)();
          }

        })
      )(props);
    }
  ),
  lifecycle({
    componentWillUnmount() {
      Object.keys(handlers).forEach(key => {
        if (this.props && this.props[key] && this.props[key].cancel) {
          this.props[key].cancel();
        }
      });
    }
  }),
  omitProps(["delayTimeout", "enableDebounce", "enableThrottle"])
);

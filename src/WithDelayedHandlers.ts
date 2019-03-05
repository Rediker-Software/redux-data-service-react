import { compose, defaultProps, lifecycle, withHandlers, withPropsOnChange } from "recompose";
import { debounce, throttle } from "lodash";
import { omitProps } from "./Helpers";

export interface IWithDelayedHandlers {
  delayTimeout?: number;
  enableDebounce?: boolean;
  enableThrottle?: boolean;
}

/**
 * An HOC which wraps recompose's `withHandlers` HOC, then wraps each of the given callback handlers
 * with `debounce` and `throttle` from `lodash` for the given `delayTimeout`.
 */
export const withDelayedHandlers = <P = any>(
  handlers,
  options: IWithDelayedHandlers = {}
) => compose<P & IWithDelayedHandlers, P>(
  defaultProps({
    delayTimeout: 200,
    enableDebounce: true,
    enableThrottle: true,
    ...options,
  }),
  withHandlers(handlers),
  withPropsOnChange(
    ["delayTimeout", "enableDebounce", "enableThrottle"].concat(Object.keys(handlers)),
    ({ delayTimeout, enableDebounce, enableThrottle, ...props }) => {
      const result = {};

      Object.keys(handlers).forEach(key => {
        console.log("handler", key);
        console.log(delayTimeout, enableDebounce, enableThrottle);
        const handler = props[key];
        const handlerDebounced = enableDebounce && debounce(handler, delayTimeout);
        const handlerThrottled = enableThrottle && throttle(handler, delayTimeout);

        const wrapper = (...args) => {
          console.log("handler called", key, args);
          if (handlerDebounced) {
            handlerDebounced(...args);
          }

          if (handlerThrottled) {
            handlerThrottled(...args);
          }
        };

        // wrapper.cancel = () => {
        //   if (handlerDebounced) {
        //     handlerDebounced.cancel();
        //   }
        //
        //   if (handlerThrottled) {
        //     handlerThrottled.cancel();
        //   }
        // };

        result[key] = enableDebounce || enableThrottle ? wrapper : handler;
      });

      console.log(result);
      // debugger;

      return result;
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

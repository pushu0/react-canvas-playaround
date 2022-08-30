
## Approach
The application implementation revolves mostly around the canvas element, which has a basic implementation in `BaseCanvas` component that expects a `draw` function that's triggered on window animation frame and an optional `clickCallback` function that handles mouse clicks.

The assets (map image) gets loaded on the index page and is passed down to `Canvas` component which is meant to handle the `draw` and `clickCallback` implementation.

`RobotStatus` component suffered some cosmetic changes. There is a separation of concern, the components that show data are displayed on the top left, the component that take action are displayed on the bottom right.

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000›
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
```

### Tests
- tests sit within the `__tests__` folder. Currently tested what I deemed crucial, the `utils` that the app relies on to calculate canvas positioning and the `Controls` component as the user interacts with it.


```bash
# run tests
$ yarn test
```

### Future Improvements

- icon with direction indicator
- more tests
- touch capability for mobile device
- zoom in / out functionality
- copy to clipboard pose history (x minutes)
- `navigator.clipboard` (copy to clipboard) fallback polyfills

### Compatibility
- as far as I know the only thing that has some compatibility issues with some older browsers is the `navigator.clipboard` (copy to clipboard) functionality, that can be easily fixed by adding some fallback polyfills


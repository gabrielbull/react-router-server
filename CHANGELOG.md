# CHANGELOG

# 4.2.3 (January 20th, 2018)

- Adds support for matching webpack imports using arrow functions

# 4.2.2 (August 1st, 2017)

- Fixed some issues with HMR

# 4.2.1 (May 14th, 2017)

- Added withDone decorator and Redux example

# 4.2.0 (April 28th, 2017)

- Made compatible with new versions of React and Webpack

# 4.1.1 (April 24th, 2017)

- Fixed issue with fetchState

# 4.1.0 (April 18th, 2017)

- Added exception handling in the render methods

# 4.0.1 (April 17th, 2017)

- Made compatible with React 15.5 
- Added typescript definitions

# 4.0.0 (March 22th, 2017)

- Removed support for react-router beta and cleaned up 

# 2.1.0 (February 12th, 2017)

- Added support for react-router beta and release

# 2.0.0 (January 21st, 2017)

- Fixed issue with render not resolving
- Added renderToStaticMarkup method

## 1.1.2 (January 21st, 2017)

- Added support for Webpack 2.2

## 1.1.1 (November 7th, 2016)

- Fixed issue with webpack production mode

## 1.1.0 (November 6th, 2016)

- Fixed issue with webpack import with no module id
- Fixed issue with modules and states not being passed on second render

## 1.0.5 (November 6th, 2016)

- Fixed problem with rendering pages that do not have modules or states

## 1.0.4 (November 6th, 2016)

- Removed unused files from dist

## 1.0.3 (November 6th, 2016)

- Improved build process

## 1.0.2 (November 6th, 2016)

- Fixed issue with the preload method that receives non array parameters

## 1.0.1 (November 5th, 2016)

- Removed debug code
 
## 1.0.0 (November 5th, 2016)

- Simplified API
- Replaced importModule by Module component for code splitting
- Added extractModules to extract modules from webpack stats
- Renamed preloadModules to preload
- Removed the custom Match component
- Removed the importWebpackBundle function
 
## 0.5.1 (November 5th, 2016)

- Fixed bug that would update an unmounted component 

## 0.5.0 (November 3rd, 2016)

- Added support for Node 7
- Updated to react-router v4.0.0-alpha.5

## 0.4.0 (October 11th, 2016)

- Changed importWebpackBundle to return the whole module instead of only the default export

## 0.3.0 (October 8th, 2016)

- Updated to react-router v4.0.0-alpha.4

## 0.2.2 (October 8th, 2016)

- Fixed bug that would instantiate new components when not necessary

## 0.2.1 (October 6th, 2016)

- Fixed issue with webpack bundle that would import the wrong module

## 0.2.0 (October 5th, 2016)

- Added webpack bundle support
- Changed import to be a callback on the importModule function

## 0.1.4 (October 4th, 2016)

- Renamed fetchProps to fetchState
- Fixed bug with calling done when re-rendering

## 0.1.3 (October 4th, 2016)

- Fixed issue with render not resolving

## 0.1.2 (October 3rd, 2016)

- Added unit tests
- Improved example

## 0.1.1 (October 2nd, 2016)

- Fixed issue with importModule method

## 0.1.0 (October 2nd, 2016)

- Initial release

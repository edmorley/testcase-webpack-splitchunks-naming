import angular from 'angular';

const userguideApp = angular.module('userguide', []);

userguideApp.config(['$compileProvider', function ($compileProvider) {
    // Disable debug data & legacy comment/class directive syntax, as recommended by:
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
}]);

export default userguideApp;

/** dirty hack, the subscription will duplicate if we come back to this component */
let routeSubscription;
angular.module('orsApp.ors-summary', []).component('orsSummaries', {
    templateUrl: 'app/components/ors-panel-routing/ors-summary/ors-summary.html',
    bindings: {
        showInstructions: '&',
        shouldDisplayRouteDetails: '<'
    },
    controller(orsSettingsFactory, orsMapFactory, orsObjectsFactory, orsRouteService, orsErrorhandlerService) {
        let ctrl = this;
        ctrl.profiles = lists.profiles;
        ctrl.setIdx = (idx) => {
            orsRouteService.setCurrentRouteIdx(idx);
            console.info(orsRouteService.getCurrentRouteIdx());
        };
        ctrl.getIdx = () => {
            return orsRouteService.getCurrentRouteIdx();
        };
        /** if we are coming back to route panel */
        if (angular.isDefined(orsRouteService.routeObj)) {
            ctrl.routes = orsRouteService.routeObj.routes;
            let idx = ctrl.getIdx();
            let action = orsObjectsFactory.createMapAction(2, lists.layers[1], undefined, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
            action = orsObjectsFactory.createMapAction(1, lists.layers[1], ctrl.routes[idx].points, undefined);
            orsMapFactory.mapServiceSubject.onNext(action);
        }
        /** if we are returning to this panel, dispose all old subscriptions */
        try {
            routeSubscription.dispose();
        } catch (error) {
            console.warn(error);
        }
        routeSubscription = orsRouteService.routesSubject.subscribe(routes => {
            ctrl.routes = routes;
        });
        ctrl.EmphRoute = (idx) => {
            const geometry = orsRouteService.routeObj.routes[idx].points;
            orsRouteService.Emph(geometry);
        };
        ctrl.DeEmphRoute = () => {
            orsRouteService.DeEmph();
        };
    }
});
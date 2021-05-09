/* global createShadowRoot, bindEventListeners, findReferences */
export default function upgrade($scope, template) {
  createShadowRoot($scope, template);
  $scope.$refs = findReferences($scope.shadowRoot);
  bindEventListeners($scope.shadowRoot, $scope);
}

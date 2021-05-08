/* global createShadowRoot, bindEventListeners, findReferences */
export default function upgrade($scope, template) {
  createShadowRoot($scope, template);
  bindEventListeners($scope.shadowRoot, $scope);

  $scope.$refs = findReferences($scope.shadowRoot);
}

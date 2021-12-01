/* global bindEventListeners, createShadowRoot, findReferences */
export default function upgrade($scope, template) {
  const isEmpty = template === false || template === null;

  if (isEmpty === false) {
    createShadowRoot($scope, template);
  }

  const $target = isEmpty ? $scope : $scope.shadowRoot;

  $scope.$refs = findReferences($target);

  bindEventListeners($target, $scope);
}

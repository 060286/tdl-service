function getTargetOfProxy(proxy) {
  return JSON.parse(JSON.stringify(proxy));
}

export { getTargetOfProxy };

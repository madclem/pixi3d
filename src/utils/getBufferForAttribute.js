function getBufferForAttribute (geometry, id) {
  const att = geometry.getAttribute(id);
  if (att) {
    return geometry.getBuffer(id)
  }
}

export { getBufferForAttribute }
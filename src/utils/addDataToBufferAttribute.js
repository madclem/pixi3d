import { getBufferForAttribute } from './'

function addDataToBufferAttribute (geometry, id, data, n) {
  const buffer = getBufferForAttribute(geometry, id);

  if (buffer) {
    buffer.update(data);
  } else {
    geometry.addAttribute(id, data, n)
  }
}

export { addDataToBufferAttribute }
export function convertToSerializeableObject(obj) {
  if (!obj) return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSerializeableObject(item));
  }

  // Handle ObjectId or other objects with toJSON method
  if (obj.toJSON && typeof obj.toJSON === "function") {
    return obj.toString();
  }

  // Handle plain objects (including nested ones)
  if (typeof obj === "object" && obj !== null) {
    const result = {};

    for (const key of Object.keys(obj)) {
      // Convert each property recursively
      result[key] = convertToSerializeableObject(obj[key]);
    }

    return result;
  }

  // Return primitive values as is
  return obj;
}

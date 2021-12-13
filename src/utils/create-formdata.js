/**
 * Create FormData object
 *
 * @param {Object} form Key-value pairs
 * @param {Array} files File array
 * @returns {Object} FormData object
 */
const createFormData = (form, files, options) => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (files) files.forEach((file) => formData.append('files', file));
    if (options) options.forEach((option) => formData.append('options', option));
    return formData;
};

export default createFormData;

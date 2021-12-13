import Papa from 'papaparse';

/**
 * Parse glossary file
 *
 * @param {Object} file Glossary file
 * @param {Array} files File array
 * @returns {Object} Glossary JSON
 */
const parseGlossary = (file) => new Promise((resolve, reject) => {
    const glossary = [];
    Papa.parse(
        file,
        {
            delimiter: ',',
            skipEmptyLines: 'greedy',
            transform: (val) => val.trim(),
            complete: (res) => {
                if (res.data) {
                    res.data.forEach((data) => {
                        data.forEach((element) => {
                            if (element !== '' && element.length <= 60) glossary.push(element);
                        });
                    });
                }
                resolve(glossary);
            },
            error: (err) => reject(err),
        },
    );
});

export default parseGlossary;

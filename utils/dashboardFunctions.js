
/////////////////////////////////////////////////////////////

const getImageColumn = (data, img_name) => {
    let img_column;
    for (let key in data.dataValues) {
        if (data.dataValues[key] === img_name) {
            img_column = key;
            break;
        }
    }
    return img_column;
}


/////////////////////////////////////////////////////////////////

const getPreviousAnnotations = (dataValues) => {
    let prevAnnotation = {}
    let count = 0;
    for (let key in dataValues) {
        if ((['img1_annotation', 'img2_annotation', 'img3_annotation', 'img4_annotation', 'img5_annotation'].includes(key)) && (dataValues[key] !== null)) {
            prevAnnotation[key] = dataValues[key];
            count++;
        }
    }
    prevAnnotation['count'] = count;
    return prevAnnotation;
}


module.exports = { getImageColumn, getPreviousAnnotations }
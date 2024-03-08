export function generateSlugFrom(
  title: string,
  from: string,
  to: string,
  start_date: string,
  end_date: string
) {
  if (!title || !from || !to || !start_date || !end_date) {
    throw new Error('Please provide all the required parameters');
  }
  const a =
    'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
  const b =
    'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  function convertToSlug(str: string) {
    return str
      .toString() // Cast to string
      .toLowerCase() // Convert the string to lowercase letters
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|å|ä/gi, 'a') // Replace a with a
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e') // Replace e with e
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i') // Replace i with i
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö/gi, 'o') // Replace o with o
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u') // Replace u with u
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y') // Replace y with y
      .replace(/đ/gi, 'd') // Replace d with d
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  return convertToSlug(
    `${title} from ${from} to ${to} from ${start_date} to ${end_date}`
  );
}

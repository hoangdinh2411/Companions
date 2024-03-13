import * as Yup from 'yup';

export const addNewCommentValidation = Yup.object().shape({
  content: Yup.string().required('Content is required'),
});

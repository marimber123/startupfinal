import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addComment } from '../reducers/postCommentsReducer';
import { notify } from '../reducers/notificationReducer';
import getErrorMsg from '../utils/getErrorMsg';

import { Link, Typography, TextField, Button } from '@material-ui/core';
import { useCommentInputStyles } from '../styles/muiStyles';
import SendIcon from '@material-ui/icons/Send';

const CommentInput = ({ user, postId, isMobile }) => {
  const classes = useCommentInputStyles();
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await dispatch(addComment(postId, comment));
      setSubmitting(false);
      setComment('');
      dispatch(notify(`Comment submitted!`, 'success'));
    } catch (err) {
      setSubmitting(false);
      dispatch(notify(getErrorMsg(err), 'error'));
    }
  };

  return (
    <div className={classes.wrapper}>
      {user ? (
        <Typography variant="body2">
          Comentar como{' '}
          <Link component={RouterLink} to={`/u/${user.username}`}>
            {user.username}
          </Link>
        </Typography>
      ) : (
        <Typography variant="body1">
          Inicia sesión o crea una cuenta para dejar un comentario
        </Typography>
      )}
      <form className={classes.form} onSubmit={handlePostComment}>
        <TextField
          placeholder={`¿Cuáles son tus pensamientos?`}
          multiline
          fullWidth
          required
          rows={4}
          rowsMax={Infinity}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.commentBtn}
          startIcon={<SendIcon />}
          size={isMobile ? 'small' : 'medium'}
          disabled={!user || submitting}
        >
          {!user ? 'Inicia sesión para comentar' : submitting ? 'Comentando' : 'Comentar'}
        </Button>
      </form>
    </div>
  );
};

export default CommentInput;

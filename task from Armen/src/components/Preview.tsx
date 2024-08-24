import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { addComments, deleteCommentt, getPost, } from '../helpers/api';
import { Link, useOutletContext } from 'react-router-dom';
import { IComment, IContext, IPost, IUser } from '../helpers/types';
import { useState, useEffect } from 'react';
import { BASE } from '../helpers/default';
import { TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  isOpen: boolean
  close: () => void
  post: number
}
export function Preview({ isOpen, close, post }: IProps) {
  const [currentPost, setCurrentPost] = useState<IPost | null>()
  const [likes, setLikes] = useState<IUser[] | null>()
  const [comments, setComments] = useState<IComment[] | null>()
  const [inputValue, setInputValue] = useState<string>("")
  // const { account } = useOutletContext<IContext>()
  useEffect(() => {
    getPost(post)
      .then(res => {
        setCurrentPost(res.payload as IPost)
        setLikes(currentPost?.likes)
        setComments((res.payload as IPost).comments)
      })

  }, [currentPost, comments])

  const addComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    addComments({ text: inputValue }, currentPost?.id as number)
    //e.target.value = ""
  }
  // const deleteComment = (id: number) => {
  //   deleteCommentt(id)
  //     .then(res => {
  //       console.log(res)
  //     })
  // }
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Box sx={style} >
            <div className='modal-container'>
              <img
                src={BASE + currentPost?.picture}
                alt="post picture"
                className='modal-conatainer-img'
              />
              <div>
                <p className='post-info'>{likes?.length} likes, {comments?.length} comments</p>
                <div>
                  <p className='post-text'>likes:</p>
                  {
                    likes?.map(like => <div key={like.id} className='liked-user'>
                      <img
                        className='prof-pic-modal'
                        src={BASE + like.picture}
                        alt="like-user-pic"
                      />
                      <Link to={"/profile/" + like.id}>{like.name} {like.surname}</Link>
                    </div>)
                  }
                </div>
                <div>
                  <p className='post-text'>comments:</p>
                  {
                    comments?.map(comment => <div key={comment.id}>
                      <p>{comment.user.name} says:</p>
                      <p>{comment.content}</p>
                    </div>)
                  }
                  {/* {
                    comments?.map(comment => {
                      return <div key={comment.id}>
                        <div>
                          <p>{comment.user.name} says:</p>
                          <p>{comment.content}</p>
                        </div>
                        {(comment.user.id == account.id) && <button onClick={() => deleteComment(comment.id as number)}>delete</button>}
                      </div>
                    })
                  } */}
                </div>
                <div>
                  <TextField onKeyDown={e => e.key == "Enter" && addComment(e)} id="standard-basic" label="What you think?" variant="standard" />
                </div>
              </div>
            </div>

          </Box>
        </Box>
      </Modal>
    </div>
  );
}

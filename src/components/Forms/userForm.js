import {useForm} from "react-hook-form";
import userService from "../../appwrite/userService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import './userForm.css'

function UserForm({post}) {
    const { register, handleSubmit} = useForm({
        defaultValues: {
            Name: post?.Name || "", 
            Email: post?.Email || "",
            Mobile: post?.Mobile || "",
            Position: post?.Position || "",
        },
        mode: "onSubmit",
    });
    
    const navigate = useNavigate();
    const userData = useSelector(state=> state.auth.userData);

    const Submit = async (data) => {
        try {
          const slug = slugTransform(data.Name || "");

          if (post) {
            let file = null;
            if (data.image && data.image[0]) {
              file = await userService.uploadFile(data.image[0]);
            }
            if (file) {
              await userService.deleteFile(post.Image);
            }

            const dbPost = await userService.updateUser(post.$id, {
              ...data,
              slug,
              Image: file ? file.$id : post.Image,
            });

            if (dbPost) {
              navigate(`/user/${dbPost.$id}`);
            }

          } else {
            if (!data.image?.[0]) {
              console.error("Image is required.");
              return;
            }

            const file = await userService.uploadFile(data.image[0]);

            if (file) {
              const dbPost = await userService.createUser({
                ...data,
                slug,                     
                Image: file.$id,
                UserID: userData.$id
              });

              if (dbPost) {
                navigate(`/user/${dbPost.$id}`);
              }
            } else {
              console.error("File upload failed");
            }
          }
        }
        catch (error) {
          console.error("Error submitting post:", error);
        }
      };


    const slugTransform = useCallback((value)=>{
      if(typeof value==='string'){
        return value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
    })

  return (
    <form
      onSubmit={handleSubmit(Submit)}
      className="post-form"
      autoComplete="off"
    >
      <div className="post_form-left">
        <input type="text" placeholder="Enter Name "
          {...register("Name", { required: true })} 
        />
        <input
          type="text"
          placeholder="Mobile No"
          {...register("Mobile", { required: true },)}
        />
        <input type="email" placeholder="Email "
          {...register("Email",{required: true})}
        />
        <input type="text" placeholder="Designation"
          {...register("Position",{required: true})}
        />
        
      </div>
      <div className="post-form-right">
          <input
              placeholder="Featured Image :"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif"
              {...register("image", { required: !post })}
          />
          {post && post.Image && (
              <div className="post-image-preview">
                  <img 
                      src={post?.featuredImage ? userService.getFilePreview(post.featuredImage) 
                          : "/default-image.png"} 
                      alt={post?.tittle } 
                  />
              </div>
          )}          
          <button type="submit" className={post ? "update-button" : "submit-button"}>
              {post ? "Update" : "Submit"}
          </button>
        </div>
    </form>
  
  )
}

export default UserForm;
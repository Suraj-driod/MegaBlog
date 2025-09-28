import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import { Service as appwriteService } from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { sortUserPlugins } from 'vite'


function Postform({ post }) {
    //setValue to set value of any field in form, getValues to get value of any field in form
    // These values are stored in our REGISTER
    //control is used to control non standard input fields like RTE, Select etc
    //register is used to register input field to react-hook-form
    //handleSubmit is used to handle form submission
    //watch is used to watch value of any field in form 
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)

    //Func to handleSubmit
    const submit = async (data) => {
        //This when we have post to edit
        if (post) {
            //This to handle File in form where submiting   
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null
            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }
            //This to handle updatePost
            const dbPost = await appwriteService.updatePost(post.$id, { ...data, featuredImage: file ? file.id : undefined })
            if (dbPost) navigate('/post/${dbPost.$id}')
        }//This part when we have to create new Post
        else {
            const file = await appwriteService.uploadFile(data.image[0]);
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })
                if (dbPost) navigate('/post/${dbPost.$id}')
            }
        }


    }

    //Slug transform used to replace empty space in a string to -
    const slugTransform = useCallback((value) => {
        //to Check if incoming value is string or not 
        if (value && typeof value == 'string') {
            return value
                .trim() //Remove all trailing whiteSpaces
                .toLowerCase() //To make all characters small 
                .replace(/^[a-zA-Z\d]+/g, '-')  // To replace whitespace with dash -
        }
        else ('')
    })

    //To watch title field and update slug field accordingly
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
                // shouldValidate is used to validate the field after setting the value
            }
        });
        //what unsubscribe does is to clean up the subscription when the component unmounts or when the dependencies change
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default Postform

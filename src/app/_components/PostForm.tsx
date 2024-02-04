"use client";

import React from "react";

import { makePost } from "~/app/_actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  myData: z.string(),
});

export type MyFormFields = z.infer<typeof formSchema>;

const PostForm = () => {
  const { register, handleSubmit, reset } = useForm<MyFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      myData: "",
    },
  });

  const onHandleSubmit = async (data: MyFormFields) => {
    await makePost(data);
    reset();
  };
  return (
    <form onSubmit={handleSubmit((data) => onHandleSubmit(data))}>
      <div>
        <label>Content</label>
        <input {...register("myData")} />
      </div>

      <button type="submit">Click to post</button>
    </form>
  );
};

export default PostForm;

import CreateEditorWrapper from "@/app/(protected-user)/columns/create/components/create-editor-wrapper";


export default async function CreateBlog() {

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <CreateEditorWrapper />
    </div>
  )
}
const Edit = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
    <label htmlFor="id" className="font-semibold block">
      Title Message
    </label>
    <input
      type="text"
      className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
      placeholder="Title Message"
      value={"Data dummy"}
    />
    <textarea name="description" rows={5} placeholder="Description"  className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam aliquam adipisci vero soluta illo odit at obcaecati possimus mollitia voluptatem iusto harum provident inventore, velit necessitatibus. Officia consequuntur assumenda debitis!
    </textarea>
  </form>
  )
}

export default Edit
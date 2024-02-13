export default function PostFeed() {
    return (
        <div className="flex flex-col
        m-0 h-full w-full 
        overflow-hidden z-0 absolute left-10 items-center"> 
            <PostItem /> 
            <PostItem /> 
        </div>  
    )
}


function PostItem(){
    return (
    <div className="h-2/5 w-10/12
    bg-gray-800/30 border border-gray-900   
    mx-0 my-6 p-8 rounded-lg border-solid 
    shadow-md z-1
    backdrop-blur-[100px]"> 
        <h1 className="text-white text-3xl top-1/2 text-center mb-10"> Hello World! </h1>
        <p className="text-white text-lg"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
    </div>
    )
}
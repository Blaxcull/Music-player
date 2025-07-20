type addtolikedprops={

    index:number

}


const AddToLiked = ({index}:addtolikedprops ) => {
    
    return (
        <div >
            <button
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => {
                    console.log(index);
                }}
            >
                add to liked
            </button>
        </div>
    );

};

export default AddToLiked;

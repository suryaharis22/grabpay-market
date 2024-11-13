const HrText = ({ title = '' }) => {
    return (
        <div className="flex justify-center items-center mb-2">
            <hr className="w-full h-0.5 mx-2 bg-gray-700" />
            <p className="text-center px-2 whitespace-nowrap">{title}</p>
            <hr className="w-full h-0.5 mx-2 bg-gray-700" />
        </div>
    );
}

export default HrText;

const MediaControl = ({callback, icon, className = 'mediaControl'}) => {
    return( 
        <div 
        onClick={callback} 
        className={className}
        style={{
            backgroundColor: '#333', 
            width: '1.5em', 
            height: '1.5em',
            borderRadius: '100VMAX', 
            color: 'white',
            textAlign: 'center', 
            justifyContent: 'center', 
            fontSize: '30px'
        }}
        >
            {icon}
        </div>
    )
}

export default MediaControl
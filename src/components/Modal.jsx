import ReactDom from 'react-dom'

// create modal with portal overlay function that has specifically just the modal content
export default function Modal(props) {
    const { children, handleCloseModal } = props
    return ReactDom.createPortal(
        // render contents of jsx page without injecting into div id='root'
        <div className='modal-container'>
            <button onClick={handleCloseModal} className='modal-underlay' />
            <div className='modal-content'>
                {children}
            </div>
        </div>,
        // render modal inside div id='portal' to get outside main application
        document.getElementById('portal')
    )
}
import "../../../../assets/css/modalbase.component.scss";

interface ModalBaseI {
    visible: boolean;
    closeModal?: () => void;
    renderHeader?: () => React.ReactNode;
    renderContent?: () => React.ReactNode;
    renderFooter?: () => React.ReactNode;
}

export const ModalBase = ({
    visible = true,
    closeModal,
    renderHeader,
    renderContent,
    renderFooter,
}: ModalBaseI) => {
    if (visible) {
        return (
            <div className='container' onClick={closeModal}>
                <div className='content'>
                    {renderHeader ? renderHeader() : <></>}
                    {renderContent ? renderContent() : <></>}
                    {renderFooter ? renderFooter() : <></>}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
};

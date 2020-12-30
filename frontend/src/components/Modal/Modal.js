import React, { Fragment, useEffect, useRef } from "react";
import Backdrop from "../Backdrop/Backdrop";
import "../../assets/scss/Modal.scss";

const Modal = (props) => {
  const modal = useRef();
  const activeClass = () => {
    if (props.isOpen) {
      modal.current.classList.add("active");
    }
  };
  useEffect(() => {
    modal.current !== undefined && activeClass();
  });

  return (
    <Fragment>
      {props.isOpen && <Backdrop />}
      {props.isOpen && (
        <div className="modal" ref={modal}>
          <header className="modal__header">
            <h1>{props.title}</h1>
          </header>
          <section className="modal__content">{props.children}</section>
          <section className="modal__actions">
            {props.canCancel && (
              <button className="btn mr-1" onClick={props.onCancel}>
                Cancel
              </button>
            )}
            {props.canConfirm && (
              <button className="btn" onClick={props.onConfirm}>
                {props.confirmText}
              </button>
            )}
          </section>
        </div>
      
      )}
    </Fragment>
  );
};

export default Modal;

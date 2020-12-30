import React from "react";

const EventItem = (props) => {
  return (
    <li className="events__list-item">
      <div>
        <h4>{props.title}</h4>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleString('tr-TR')}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>Your the owner of this event</p>
        ) : (
          <button className="btn" onClick={() => props.onDetail(props.eventId)}>View Details</button>
        )}
      </div>
    </li>
  );
};

export default EventItem;

import React, { Fragment, useState, useContext, useEffect } from "react";
import "../assets/scss/Events.scss";
import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Spinner from "../components/Spinner/Spinner";
import EventList from "../components/Events/EventList/EventList";
import { toast } from 'react-toastify';
const Events = () => {
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [eventList, setEventList] = useState([]);
  const context = useContext(AuthContext);
  const token = context.token;
  const  GRAPHQL_URL = '/graphql';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    const requestBody = {
      query: `
          query{
            events{
              _id
              title
              description
              price
              date
              creator{
                _id
                email
              }
            }
          }
        `,
    };

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEventList(events);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.message)
      });
  };

  const createEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = {
      title,
      price,
      date,
      description,
    };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title:String!, $description:String!, $price:Float!,$date:String!){
            createEvent(eventInput:{title:$title, description:$description,price:$price,date:$date}){
              _id
              title
              description
              price
              date
              creator{
                _id
                email
              }
            }
          }
        `,
      variables: {
        title: title,
        description: description,
        price: parseFloat(price),
        date: date,
      },
    };

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message)
      });
  };
  const modalCancelHandler = () => {
    setCreating(false);
    setViewingDetail(false);
  };

  const showDetailHandler = (eventId) => {
    const selectedEvent = eventList.find((e) => e._id === eventId);
    setSelectedEvent(selectedEvent);
    setViewingDetail(true);
  };

  const orderEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      setViewingDetail(false);
      return;
    }
    const requestBody = {
      query: `
      mutation OrderEvent($id:ID!) {
            orderEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
      variables: {
        id: selectedEvent._id,
      },
    };

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent(null);
        setViewingDetail(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message)
      });
  };

  return (
    <Fragment>
      <div className="events">
        <h1 className="text-center">Events Page</h1>
        <Modal
          isOpen={creating}
          title="Add Event"
          canCancel
          canConfirm
          confirmText="Confirm"
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                id="description"
                row="4"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={viewingDetail}
          title={selectedEvent?.title}
          canCancel
          canConfirm
          confirmText={context.token ? "Order Now" : "Confirm"}
          onCancel={modalCancelHandler}
          onConfirm={orderEventHandler}
        >
          <h1>{selectedEvent?.title}</h1>
          <h2>
            ${selectedEvent?.price} -
            {new Date(selectedEvent?.date).toLocaleString("tr-TR")}
          </h2>
          <p>{selectedEvent?.description}</p>
        </Modal>
        {context.token && (
          <div className="events__control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={createEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {loading ? (
          <Spinner />
        ) : (
          <EventList
            events={eventList}
            authUserId={context.userId}
            onViewDetail={showDetailHandler}
          />
        )}
      </div>
    </Fragment>
  );
};

export default Events;

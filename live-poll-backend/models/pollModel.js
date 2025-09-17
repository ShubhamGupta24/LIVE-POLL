// models/pollModel.js
let polls = [];
let nextId = 1;

const create = ({ question, options, duration }) => {
    const poll = {
        id: nextId++,
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        duration: duration || 60,
        active: true,
    };
    polls.push(poll);
    return poll;
};

const findById = (id) => polls.find(p => p.id === id);

module.exports = { create, findById };

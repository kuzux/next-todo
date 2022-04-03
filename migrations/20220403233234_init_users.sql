-- +goose Up
-- +goose StatementBegin
create table users (
    id integer primary key autoincrement,
    username text not null,
    passwordHash text not null
);
alter table items add column userId not null references users(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
alter table items drop column userId;
drop table users;
-- +goose StatementEnd

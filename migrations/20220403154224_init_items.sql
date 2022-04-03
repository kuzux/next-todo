-- +goose Up
-- +goose StatementBegin
CREATE TABLE `items` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `name` TEXT NOT NULL, 
    `createdAt` DATETIME NOT NULL, 
    `completedAt` DATETIME, 
    `status` INTEGER NOT NULL DEFAULT 0);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
drop table items;
-- +goose StatementEnd

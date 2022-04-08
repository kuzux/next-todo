#!/usr/bin/env bash
rm test.db
goose -dir migrations sqlite3 ./test.db up
PORT=4444 DB=test.db npm run dev &> /dev/null &
pid=$!
npm run test:e2e
kill $!
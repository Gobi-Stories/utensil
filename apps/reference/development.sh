#!/bin/sh
if [ "$USE_POLLING" == "true" ]; then
  echo "Polling enabled"
fi

source /usr/local/bin/entrypoint.sh $@

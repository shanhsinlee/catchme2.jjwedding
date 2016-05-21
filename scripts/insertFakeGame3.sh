echo -n "要新增遊戲三的排行榜？ (y/n)? "
read answer
if echo "$answer" | grep -iq "^y" ;then
  echo "insert!"
  redis-cli -p 7372 < ./game3Fake.redisCmds
  exit 1
else
  echo "exit"
fi

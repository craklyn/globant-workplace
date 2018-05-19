for f in *.png ; do 
  convert "$f" -resize 150x150\! -quality 100 "../faces/$f"
done


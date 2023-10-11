#!/bin/bash

# Define the URL with placeholders
url="https%3A%2F%2Fwybierztak.pl%2F%3Fd%3D10%26ko%3D_ko_%26lewica%3D_lewica_%26td%3D_td_"

# Define the array of options
options=("0" "1")

# Loop over the options and their values
for ko in "${options[@]}"
do
  for td in "${options[@]}"
  do
    for lewica in "${options[@]}"
    do
      # Replace the placeholders with the current option values
      current_url="${url//_ko_/$ko}"
      current_url="${current_url//_td_/$td}"
      current_url="${current_url//_lewica_/$lewica}"

      # Construct the output file name
      output_file="img/og-images/ko-${ko}-lewica-${lewica}-td-${td}.png"

      # Construct the curl command with the current URL and output file name
      curl_command="curl -o $output_file https://wybieramtak-og-image.azurewebsites.net/screenshot?url=$current_url"

      # Execute the curl command
      eval $curl_command
    done
  done
done
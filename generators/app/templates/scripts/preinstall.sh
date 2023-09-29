#!/usr/bin/env bash

# Check if sudo is installed/necessary for running commands
# this is useful in a docker environment where we login as root
if command -v sudo &> /dev/null ; then
  SUDO="sudo"
else
  SUDO=""
fi

# for example:
# $SUDO apt update

# Install here the dependencies your C++ project needs

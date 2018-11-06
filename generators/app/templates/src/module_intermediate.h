#pragma once

#include <napi.h>

class <%= moduleClassName %> : public Napi::ObjectWrap<<%= moduleClassName %>>
{
public:
    <%= moduleClassName %>(const Napi::CallbackInfo&);
    Napi::Value Greet(const Napi::CallbackInfo&);

    static Napi::Function GetClass(Napi::Env);

private:
    std::string _greeterName;
};

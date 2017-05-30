#pragma once

#include <napi.h>

class <%= moduleClassName %> : public Napi::ObjectWrap<<%= moduleClassName %>>
{
public:
    static void Initialize(Napi::Env&, Napi::Object&);

    <%= moduleClassName %>(const Napi::CallbackInfo&);
    Napi::Value Greet(const Napi::CallbackInfo&);

private:
    Napi::Reference<Napi::String> _greeterName;
};
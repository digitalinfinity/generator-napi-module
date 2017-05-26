#include <napi.h>

using namespace Napi;

Value GetGreetingCallback(const CallbackInfo& info) {
    return String::New(info.Env(), "hello");
}

Object Init<%= moduleClassName %>Object(Env env) {
    Object exports = Object::New(env);
    exports["getGreeting"] = Function::New(env, GetGreetingCallback, "getGreeting");

    return exports;
}

void Init(Env env, Object exports, Object module) {
    exports.Set("<%= moduleClassName %>", Init<%= moduleClassName %>Object(env));
}

NODE_API_MODULE(addon, Init)
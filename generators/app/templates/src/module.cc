#include <napi.h>

using namespace Napi;

void MyFuncCallback(const CallbackInfo& info) {
    printf("Hello myFunc\n");
}

Object Init<%= moduleClassName %>Object(Env env) {
    Object exports = Object::New(env);
    exports["myFunc"] = Function::New(env, MyFuncCallback, "myFunc");

    return exports;
}

void Init(Env env, Object exports, Object module) {
    exports.Set("<%= moduleClassName %>", Init<%= moduleClassName %>Object(env));
}

NODE_API_MODULE(addon, Init)
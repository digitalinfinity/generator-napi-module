#include "<%= moduleHeaderFileName %>"

using namespace Napi;

void <%= moduleClassName %>::Initialize(Napi::Env& env, Object& target) {
    Napi::Function constructor = DefineClass(env, "<%= moduleClassName %>", {
        InstanceMethod("greet", &Greet)
    });

    target.Set("<%= moduleClassName %>", constructor);
}

Napi::Value <%= moduleClassName %>::Greet(const Napi::CallbackInfo& info) {
    if (info.Length() < 1)
    {
        throw Error::New(info.Env(), "You need to introduce yourself to greet");
    }

    String name = info[0].As<String>();

    printf("Hello %s\n", name.Utf8Value().c_str());
    printf("I am %s\n", this->_greeterName.Value().Utf8Value().c_str());

    return this->_greeterName.Value();
}

<%= moduleClassName %>::<%= moduleClassName %>(const Napi::CallbackInfo& info) {
    if (info.Length() < 1)
    {
        throw Error::New(info.Env(), "You must name me");
    }

    this->_greeterName = Persistent(info[0].As<String>());
}

void Init(Env env, Object exports, Object module) {
    <%= moduleClassName %>::Initialize(env, exports);
}

NODE_API_MODULE(addon, Init)
def to_camel_case(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def convert_dict_keys_to_camel_case(data):
    if isinstance(data, list):
        return [convert_dict_keys_to_camel_case(item) for item in data]
    elif isinstance(data, dict):
        return {to_camel_case(k): convert_dict_keys_to_camel_case(v) for k, v in data.items()}
    else:
        return data
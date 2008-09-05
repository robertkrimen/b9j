b9jTest(function(test) {

    test.is("ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad".replace(/ /g, ""), b9j.digest.sha256.base16("abc"));
    test.is("248d6a61 d20638b8 e5c02693 0c3e6039 a33ce459 64ff2167 f6ecedd4 19db06c1".replace(/ /g, ""), b9j.digest.sha256.base16("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"));
    test.is("ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad".replace(/ /g, ""), b9j.digest.sha256.calculate16("abc"));
    test.is("248d6a61 d20638b8 e5c02693 0c3e6039 a33ce459 64ff2167 f6ecedd4 19db06c1".replace(/ /g, ""), b9j.digest.sha256.calculate16("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"));

    test.is("ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=".replace(/ /g, ""), b9j.digest.sha256.base64("abc"));
    test.is("JI1qYdIGOLjlwCaTDD5gOaM85Flk/yFn9uzt1BnbBsE=".replace(/ /g, ""), b9j.digest.sha256.base64("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"));
    test.is("ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=".replace(/ /g, ""), b9j.digest.sha256.calculate64("abc"));
    test.is("JI1qYdIGOLjlwCaTDD5gOaM85Flk/yFn9uzt1BnbBsE=".replace(/ /g, ""), b9j.digest.sha256.calculate64("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"));

//    test.is("".replace(/ /g, ""), b9j.digest.sha256.string("abc"));
//    test.is("".replace(/ /g, ""), b9j.digest.sha256.string("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"));

});

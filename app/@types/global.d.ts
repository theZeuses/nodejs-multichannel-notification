declare global {
    /*~ Here, declare things that go in the global namespace, or augment
     *~ existing declarations in the global namespace
     */
     type valueOf<T> = T[keyof T];
     type StringValueOf<T> = T[keyof T] & string;
}
export {}

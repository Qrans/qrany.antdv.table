<script>
export default {
  functional: true,
  name: "BAction",
  props: { v: { type: Object, required: true } },
  render(_, { props }) {
    return props.v;
  },
};
</script>
